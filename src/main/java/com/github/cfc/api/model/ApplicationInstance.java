/**
 * 
 */
package com.github.cfc.api.model;

import static org.mvel2.MVEL.evalToString;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
public class ApplicationInstance {

    private final String id;

    private final String state;

    private final String consoleIp;

    private final String consolePort;

    public ApplicationInstance(String id, String state, String consoleIp, String consolePort) {
        this.id = id;
        this.state = state;
        this.consoleIp = consoleIp;
        this.consolePort = consolePort;
    }

    public String getId() {
        return id;
    }

    public String getState() {
        return state;
    }

    public String getConsoleIp() {
        return consoleIp;
    }

    public String getConsolePort() {
        return consolePort;
    }

    public boolean isRunning() {
        return "RUNNING".equals(state);
    }

    public static ApplicationInstance fromCloudFoundryModel(String key, Object response) {
        return new ApplicationInstance(key, evalToString("state", response),
                evalToString("console_ip", response),
                evalToString("console_port", response));
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                .append("id", id)
                .append("state", state)
                .append("consoleIp", consoleIp)
                .append("consolePort", consolePort).toString();
    }

}
